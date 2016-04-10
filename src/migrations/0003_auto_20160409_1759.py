# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-09 17:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('trojsten_calendar', '0002_auto_20160406_2054'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='fromdate',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='event',
            name='todate',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
