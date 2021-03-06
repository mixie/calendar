# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-18 12:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trojsten_calendar', '0008_auto_20160412_2059'),
    ]

    operations = [
        migrations.CreateModel(
            name='IcsCalendar',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.CharField(max_length=300)),
                ('public', models.BooleanField(default=True)),
                ('categories', models.ManyToManyField(to='trojsten_calendar.Category')),
                ('groups', models.ManyToManyField(to='trojsten_calendar.Group')),
            ],
        ),
    ]
