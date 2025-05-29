from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

User = get_user_model()

# On désenregistre d'abord l'admin par défaut pour pouvoir le personnaliser
admin.site.unregister(User)

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display  = ('username', 'email', 'is_staff', 'is_active', 'date_joined')
    list_filter   = ('is_staff', 'is_active')
    search_fields = ('username', 'email')