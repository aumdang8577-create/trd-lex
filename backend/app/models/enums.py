from enum import Enum

class Role(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"
    SELLER = "SELLER"
    INVESTOR = "INVESTOR"
    OFFICER = "OFFICER"

class ListingStatus(str, Enum):
    ACTIVE = "ACTIVE"
    SOLD = "SOLD"
    HIDDEN = "HIDDEN"
    IN_NEGOTIATION = "IN_NEGOTIATION"
