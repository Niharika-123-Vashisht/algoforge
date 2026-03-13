from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('problems', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='tags',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
