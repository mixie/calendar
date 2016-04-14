from rest_framework import viewsets, mixins
from .models import Event, Group, CategoryGroup, Category
from .serializers import EventSerializer, GroupSerializer, CategoryGroupSerializer, CategorySerializer
from rest_framework import filters, generics
import django_filters


class EventViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        #user = self.request.user
        qs = Event.objects.all()

        if "organizators" in self.request.GET:
            qs = qs.filter(groups__pk__in=self.request.GET["organizators"].split(','))

        for cg in CategoryGroup.objects.all():
            name = "category_%s" % str(cg.pk)
            if name in self.request.GET:
                qs = qs.filter(categories__pk__in=self.request.GET[name].split(','))
        return qs

    serializer_class = EventSerializer

class CategoryViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):

    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryGroupViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = CategoryGroup.objects.all()
    serializer_class = CategoryGroupSerializer


class GroupViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
