from enum import Enum

class Role(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class ListingStatus(str, Enum):
    ACTIVE = "ACTIVE"
    SOLD = "SOLD"
    HIDDEN = "HIDDEN"
    IN_NEGOTIATION = "IN_NEGOTIATION"
