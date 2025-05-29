from django.conf import settings
from django.db import models
from decimal import Decimal

class Devis(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='devis')
    numero_opportunite = models.CharField(max_length=50, unique=True)
    type_de_bien       = models.CharField(max_length=3, choices=[('H','Habitation'),('NH','Hors habitation')])
    type_de_garantie   = models.CharField(max_length=3, choices=[('DO','DO seule'),('TRC','TRC seule'),('DUO','Duo')])
    destination_ouvrage= models.CharField(max_length=3, choices=[('H','Habitation'),('NH','Non habitation')])
    types_travaux      = models.CharField(max_length=4, choices=[('NEUF','Neuf'),('RL','Renov. légère'),('RUR','Renov. lourde')])
    cout_ouvrage       = models.DecimalField(max_digits=12, decimal_places=2)
    presence_existant  = models.BooleanField(default=False)
    client_vip         = models.BooleanField(default=False)
    souhaite_rcmo      = models.BooleanField(default=False)
    created_at         = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "devis"
        verbose_name_plural = "devis"

    @property
    def tarif_trc(self):
        return (self.cout_ouvrage * Decimal('0.01')).quantize(Decimal('0.01'))

    @property
    def tarif_do(self):
        return (self.cout_ouvrage * Decimal('0.005')).quantize(Decimal('0.01'))

    @property
    def tarif(self):
        if self.type_de_garantie == 'TRC':
            return self.tarif_trc
        if self.type_de_garantie == 'DO':
            return self.tarif_do
        return (self.tarif_trc + self.tarif_do).quantize(Decimal('0.01'))

    @property
    def taux_seul(self):
        return {'TRC':Decimal('0.01'),'DO':Decimal('0.005'),'DUO':Decimal('0.015')}[self.type_de_garantie]

    @property
    def prime_seule(self):
        return {'TRC':Decimal('20000'),'DO':Decimal('10000'),'DUO':Decimal('30000')}[self.type_de_garantie]

    @property
    def prime_totale(self):
        return (self.cout_ouvrage * self.taux_seul + self.prime_seule).quantize(Decimal('0.01'))

    def __str__(self):
        return f"{self.numero_opportunite} – {self.user.username}"