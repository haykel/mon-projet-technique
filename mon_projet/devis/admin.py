from django.contrib import admin
from .models import Devis

@admin.register(Devis)
class DevisAdmin(admin.ModelAdmin):
    list_display  = ('numero_opportunite', 'user', 'tarif', 'prime_totale', 'created_at')
    list_filter   = ('user', 'type_de_garantie')
    search_fields = ('numero_opportunite', 'user__username')
    actions       = ['delete_selected']