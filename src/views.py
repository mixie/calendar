from rest_framework import viewsets, mixins
from .models import Event, CategoryGroup, Category, IcsCalendar
from django.contrib.auth.models import User, Group
from .serializers import EventSerializer, GroupSerializer, CategoryGroupSerializer, CategorySerializer, IcsCalendarSerializer
from rest_framework import filters, generics
import django_filters
from django.shortcuts import render
from datetime import datetime
from icsconvert import *
from django.http import HttpResponse
from django.utils.crypto import get_random_string
from django.http import JsonResponse


class EventViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        qs = Event.objects.all()

        if "organizators" in self.request.GET:
            if self.request.GET["organizators"].split(',')[0]=='':
                return []
            qs = qs.filter(groups__pk__in=self.request.GET["organizators"].split(','))

        if self.request.user.is_authenticated(): 
            qs=qs.filter(groups__pk__in=self.request.user.groups.all())

        if(not self.request.user.groups.filter(name="veduci").exists()):
            qs= qs.filter(public=True)

        for cg in CategoryGroup.objects.all():
            name = "category_%s" % str(cg.pk)
            if name in self.request.GET:
                qs = qs.filter(categories__pk__in=self.request.GET[name].split(','))
        if "end" in self.request.GET:
            qs = qs.exclude(start__gt=datetime.fromtimestamp(int(self.request.GET["end"])/1e3))
        if "start" in self.request.GET:
            qs = qs.filter(end__gt=datetime.fromtimestamp(int(self.request.GET["start"])/1e3))
        return qs

    def perform_create(self, serializer):
        if(self.request.user.groups.filter(name="veduci").exists()):
            serializer.save()
        
    serializer_class = EventSerializer


class EventDetailViewSet(generics.RetrieveUpdateDestroyAPIView):
    def perform_update(self, serializer):
        if(self.request.user.groups.filter(name="veduci").exists()):
            serializer.save()

    def perform_delete(self, serializer):
        if(self.request.user.groups.filter(name="veduci").exists()):
            serializer.save()

    queryset = Event.objects.all()
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

    def get_queryset(self):
        return self.request.user.groups.all()

    serializer_class = GroupSerializer


class IcsCalendarViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    def perform_create(self, serializer):
        url = get_random_string(length=20)
        serializer.save(url=url)

    queryset = IcsCalendar.objects.all()
    serializer_class = IcsCalendarSerializer

def onlyPublic(request):
    return JsonResponse({'onlyPublic':request.user.groups.filter(name="veduci").exists()})


def ics(request, gen):
    qsfilter = IcsCalendar.objects.filter(url=gen)

    cats = qsfilter[0].categories.all()
    orgs = qsfilter[0].groups.all()
    orgspk = [o.pk for o in orgs]
    catspk = [c.pk for c in cats]

    qs = Event.objects.all()
    qs = qs.filter(groups__pk__in=orgspk)

    for cg in CategoryGroup.objects.all():
        catsingroup = [c.pk for c in Category.objects.filter(category_group=cg.pk)]
        filteredcats = [c for c in catspk if c in catsingroup]
        if len(filteredcats) > 0:
            qs = qs.filter(categories__pk__in=filteredcats)

    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename="%s.ics"' % qsfilter[0].title
    response.write(convertEventsToCal(qsfilter[0].title, qs))
    return response