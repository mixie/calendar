# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-24 14:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trojsten_calendar', '0012_auto_20160419_2138'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Group',
        ),
        migrations.AlterField(
            model_name='event',
            name='groups',
            field=models.ManyToManyField(blank=True, null=True, to='auth.Group'),
        ),
        migrations.AlterField(
            model_name='icscalendar',
            name='groups',
            field=models.ManyToManyField(to='auth.Group'),
        ),
    ]
