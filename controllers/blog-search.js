
const axios = require('axios');
const _ = require('lodash');
require("dotenv").config();

const API_URL = process.env.API_URL;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

const blogSearch = async (req, res, next) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'x-hasura-admin-secret': ADMIN_SECRET,
            },
        });
        const blogData = response.data;
        // console.log(blogData)
        const searchTerm = req.query;
        // console.log(searchTerm.query)
        if (!searchTerm.query) {
            return res.status(400).json({ error: 'Search term is required' });
        }
        const filteredBlogs = _.filter(blogData.blogs, (blog) => {
            return blog.title.toLowerCase().includes(searchTerm.query.toLowerCase());
        });
        res.json(filteredBlogs);
        next()
    } catch (error) {
        console.error('Error fetching blog data:', error);
        res.status(500).json({ error: 'Failed to fetch blog data from the API' });
    }


}
module.exports = blogSearch;