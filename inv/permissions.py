from rest_framework import permissions


class IsOwnerOrReardOnly(permissions.BasePermission):
    """
    Custom permission for testing pourpuses
    """

    def has_object_permission(self, request, view, obj):
        # Read permited to anyone
        # so we'll allow GET, HEAD and OPTIONS request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permission only allowed to the owner of the obj
        return obj.owner == request.user
