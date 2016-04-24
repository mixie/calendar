from __future__ import unicode_literals

from django.db import models

from datetime import datetime

from django.utils import timezone

from django.contrib.auth.models import User, Group


class CategoryGroup(models.Model):
    title = models.CharField(max_length=300,  default="")

    def __str__(self):
        return self.title


class Category(models.Model):
    title = models.CharField(max_length=300, default="")
    category_group = models.ForeignKey(CategoryGroup)

    def __str__(self):
        return self.title


class IcsCalendar(models.Model):
    url = models.CharField(max_length=300)
    title = models.CharField(max_length=300, default="")
    public = models.BooleanField(default=True)
    categories = models.ManyToManyField(Category, blank=True)
    groups = models.ManyToManyField(Group)

    def __str__(self):
        return self.title


class Event(models.Model):
    title = models.CharField(max_length=300)
    start = models.DateTimeField(default=timezone.now)
    end = models.DateTimeField(default=timezone.now,null=True, blank=True)
    public = models.BooleanField(default=True)
    allDay = models.BooleanField(default=True)
    categories = models.ManyToManyField(Category,null=True, blank=True)
    groups = models.ManyToManyField(Group,null=True, blank=True)

    def __str__(self):
        return self.title