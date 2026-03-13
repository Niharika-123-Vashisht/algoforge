from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('problems', '0003_problem_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='companies',
            field=models.JSONField(blank=True, default=list),
        ),
    ]
