from pgvector.django import VectorExtension
from django.db import migrations

# Create a migration to enable the extension
# Instruct PostgreSQL to install and activate the special “vector” column type—needed for storing embeddings.
class Migration(migrations.Migration):
    operations = [
        VectorExtension()
    ]