# MongoDB Atlas vector search setup

Campus document chunks are stored in the `campus_documents` collection. The
backend uses the Atlas index named by `ATLAS_VECTOR_INDEX` (default:
`vector_index`).

Create an Atlas Vector Search index for that collection with this definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "metadata.type"
    }
  ]
}
```

The 1536 dimensions correspond to the default `text-embedding-3-small` model.
If the embedding model changes, recreate the index with the matching dimension.
Development falls back to in-process cosine ranking when the index is absent;
production requires the Atlas index.
