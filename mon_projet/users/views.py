from rest_framework import generics, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth import authenticate
from .serializers import UserCreateSerializer, LoginSerializer

class UserCreateAPIView(generics.CreateAPIView):
    """
    Enregistrement d'un nouvel utilisateur.
    """
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Enregistrer un nouvel utilisateur",
        request_body=UserCreateSerializer,
        responses={201: openapi.Response('Utilisateur créé', UserCreateSerializer)}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

class LoginAPIView(APIView):
    """
    Authentification : renvoie un token.
    """
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Obtenir un token en s'authentifiant",
        request_body=LoginSerializer,
        responses={
            200: openapi.Response('Token créé', schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={'token': openapi.Schema(type=openapi.TYPE_STRING)}
            )),
            400: 'Identifiants invalides'
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )
        if not user:
            return Response({'error': 'Identifiants invalides'}, status=status.HTTP_400_BAD_REQUEST)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)

class LogoutAPIView(APIView):
    """
    Déconnexion : suppression du token.
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Supprimer le token de l'utilisateur authentifié",
        responses={204: 'Déconnexion réussie'}
    )
    def post(self, request):
        request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)