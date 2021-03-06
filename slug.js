const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slugSchema = new Schema({
    slug: {
        type: String,
        required: true
    },
    redirect: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: 'created_at' } });

const Slug = mongoose.model('SlugStore', slugSchema);
module.exports = Slug;

