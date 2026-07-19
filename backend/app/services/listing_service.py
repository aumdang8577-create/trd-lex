from fastapi import HTTPException, status
from app.core.database import db
from app.schemas.listing import CreateListingRequest, UpdateListingRequest, UpdateListingStatusRequest, ListingListResponse, ListingResponse, ListingMeta
from app.models.enums import ListingStatus
from prisma.models import User

class ListingService:
    @staticmethod
    async def get_listings(
        province: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        page: int = 1,
        per_page: int = 10
    ) -> ListingListResponse:
        
        # Build where clause dynamic filter
        where_clause = {
            "status": ListingStatus.ACTIVE.value
        }
        
        if min_price is not None or max_price is not None:
            price_filter = {}
            if min_price is not None:
                price_filter["gte"] = min_price
            if max_price is not None:
                price_filter["lte"] = max_price
            where_clause["asking_price"] = price_filter
            
        if province:
            where_clause["contract"] = {
                "province": province
            }
            
        # Count total items
        total_items = await db.listing.count(where=where_clause)
        
        # Query listings
        listings = await db.listing.find_many(
            where=where_clause,
            include={
                "seller": True,
                "contract": True
            },
            order={"createdAt": "desc"},
            skip=(page - 1) * per_page,
            take=per_page
        )
        
        # Parse items to ListingResponse
        data = [ListingResponse.model_validate(item) for item in listings]
        
        meta = ListingMeta(
            total_items=total_items,
            page=page,
            per_page=per_page
        )
        
        return ListingListResponse(data=data, meta=meta)

    @staticmethod
    async def get_listing_by_id(listing_id: str) -> ListingResponse:
        listing = await db.listing.find_unique(
            where={"id": listing_id},
            include={
                "seller": True,
                "contract": True
            }
        )
        
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ไม่พบประกาศที่ระบุ"
            )
            
        return ListingResponse.model_validate(listing)

    @staticmethod
    async def create_listing(listing_data: CreateListingRequest, current_user: User) -> ListingResponse:
        # Check if contract exists and belongs to user
        contract = await db.leasecontract.find_unique(
            where={"id": listing_data.contractId}
        )
        
        if not contract:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="ไม่พบข้อมูลสัญญาเช่าในระบบ"
            )
            
        if not contract.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="สัญญาเช่านี้ถูกระงับหรือสิ้นสุดลงแล้ว ไม่สามารถทำรายการได้"
            )
            
        if contract.lessee_thaid_id != current_user.thaid_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="คุณไม่มีสิทธิ์เข้าถึงหรือเสนอขายสิทธิ์ของสัญญานี้"
            )
            
        # Check if contract already has an ACTIVE listing
        existing_active = await db.listing.find_first(
            where={
                "contractId": listing_data.contractId,
                "status": ListingStatus.ACTIVE.value
            }
        )
        if existing_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="สัญญานี้มีประกาศขายที่ยังเปิดอยู่แล้วในระบบ"
            )
            
        # Calculate estimated transfer fee (3% of asking price)
        estimated_fee = listing_data.asking_price * 0.03
        
        # Create listing in DB
        new_listing = await db.listing.create(
            data={
                "sellerId": current_user.id,
                "contractId": listing_data.contractId,
                "asking_price": listing_data.asking_price,
                "estimated_fee": estimated_fee,
                "description": listing_data.description,
                "image_urls": listing_data.image_urls,
                "status": ListingStatus.ACTIVE.value
            },
            include={
                "seller": True,
                "contract": True
            }
        )
        
        return ListingResponse.model_validate(new_listing)

    @staticmethod
    async def update_listing(listing_id: str, update_data: UpdateListingRequest, current_user: User) -> ListingResponse:
        # Fetch listing
        listing = await db.listing.find_unique(where={"id": listing_id})
        
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ไม่พบประกาศที่ต้องการแก้ไข"
            )
            
        # Check ownership
        if listing.sellerId != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="คุณไม่ใช่เจ้าของประกาศนี้ ไม่สามารถแก้ไขข้อมูลได้"
            )
            
        # Prepare data for update
        db_update_data = {}
        if update_data.asking_price is not None:
            db_update_data["asking_price"] = update_data.asking_price
            db_update_data["estimated_fee"] = update_data.asking_price * 0.03
            
        if update_data.description is not None:
            db_update_data["description"] = update_data.description
            
        if update_data.image_urls is not None:
            db_update_data["image_urls"] = update_data.image_urls
            
        # Perform update
        updated_listing = await db.listing.update(
            where={"id": listing_id},
            data=db_update_data,
            include={
                "seller": True,
                "contract": True
            }
        )
        
        return ListingResponse.model_validate(updated_listing)

    @staticmethod
    async def update_listing_status(listing_id: str, status_data: UpdateListingStatusRequest, current_user: User) -> ListingResponse:
        # Fetch listing
        listing = await db.listing.find_unique(where={"id": listing_id})
        
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ไม่พบประกาศที่ต้องการปรับสถานะ"
            )
            
        # Check ownership (or check if admin)
        if listing.sellerId != current_user.id and current_user.role != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="คุณไม่มีสิทธิ์ในการปรับเปลี่ยนสถานะประกาศนี้"
            )
            
        # Update status
        updated_listing = await db.listing.update(
            where={"id": listing_id},
            data={"status": status_data.status.value},
            include={
                "seller": True,
                "contract": True
            }
        )
        
        return ListingResponse.model_validate(updated_listing)

    @staticmethod
    async def get_my_listings(current_user: User) -> list[ListingResponse]:
        listings = await db.listing.find_many(
            where={
                "sellerId": current_user.id
            },
            include={
                "seller": True,
                "contract": True
            },
            order={"createdAt": "desc"}
        )
        return [ListingResponse.model_validate(item) for item in listings]

    @staticmethod
    async def delete_listing(listing_id: str, current_user: User) -> None:
        # Fetch listing
        listing = await db.listing.find_unique(where={"id": listing_id})
        
        if not listing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ไม่พบประกาศที่ต้องการลบ"
            )
            
        # Check ownership
        if listing.sellerId != current_user.id and current_user.role != "ADMIN":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="คุณไม่มีสิทธิ์ในการลบประกาศนี้"
            )
            
        # Perform delete
        await db.listing.delete(where={"id": listing_id})
