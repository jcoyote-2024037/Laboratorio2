import { Schema, model } from 'mongoose';

const ComentarioSchema = new Schema({
  contenido: {
    type: String,
    required: true
  },
  autor: {
    type: Number,  // id del usuario (Postgres)
    required: true
  }
}, {
  timestamps: true
});

const PublicacionSchema = new Schema({
  titulo: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  contenido: {
    type: String,
    required: true
  },
  autor: {
    type: Number,
    required: true
  },
  comentarios: [ComentarioSchema] 
}, {
  timestamps: true
});

export default model('Publicacion', PublicacionSchema);