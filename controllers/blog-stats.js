
const axios = require('axios');
const _ = require('lodash');

const API_URL = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const ADMIN_SECRET = '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';
const blogStats = async (req, res, next) => {
    try {
        // Use axios to make the curl request to fetch blog data
        const response = await axios.get(API_URL, {
            headers: {
                'x-hasura-admin-secret': ADMIN_SECRET,
            },
        });

        if (response.status === 200) {
            const blogData = response.data;
            return blogData;

        } else {
            res.status(500).json({ error: 'Failed to fetch blog data from the API' });
        }
    } catch (error) {
        console.error('Error fetching blog data:', error);
        res.status(500).json({ error: 'Failed to fetch blog data from the API' });
    }
}

const memoizedblogStats = _.memoize(blogStats, (adminSecret) => adminSecret, 1800000); //memoization for 0.5 hours that is 1800000 seconds 

const final = async (req, res, next) => {
    console.log("Blog request called")
    try {
        blogData = await memoizedblogStats();
        //total number of blogs fetched 
        const totalBlogs = _.size(blogData.blogs);
        // console.log(totalBlogs);


        //blog with longest title
        const blogWithLongestTitle = _.maxBy(blogData.blogs, (blog) => blog.title.length);
        // console.log(blogWithLongestTitle)

        //number of blogs with title including word "privacy"
        const blogsWithPrivacy = _.filter(blogData.blogs, (blog) => {
            return blog.title.toLowerCase().includes("privacy");
        });
        const numberOfPrivacy = blogsWithPrivacy.length;
        // console.log('Number of blogs with titles containing "privacy":', numberOfPrivacy);

        //creating an array with no duplicate va/lues
        const unique = _.uniqBy(blogData.blogs, 'title').map((blog) => blog.title);
        // console.log('Unique blog titles:', unique);

        const responseToSend = {
            "total Blogs": totalBlogs,
            "Blog with longest title": blogWithLongestTitle,
            "Number of blogs having word 'privacy'": numberOfPrivacy,
            "Array with no duplicate values": unique
        }
        res.status(200).send(responseToSend);
        next()
    } catch (error) {
        console.error('Error fetching blog data:', error);
        res.status(500).json({ error: 'Failed to fetch blog data from the API' });
    }
}



module.exports = { final };