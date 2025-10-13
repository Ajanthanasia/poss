from flask import Blueprint, request, jsonify
from app.controllers.admin_owners_controller import (
    index_owners,
    get_owner,
    store_owner_with_token,
    delete_owner
)
from app.controllers.shop_controller import get_owners
import traceback

ownerRoute = Blueprint('owner', __name__, url_prefix='/api/owns')  # same prefix as before
