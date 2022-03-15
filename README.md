# Github as CMS
**Hi there!**

This one is not full complete product, but probably you are looking
for some startup template to adapt on your need
##What is it?
The idea was born when i decided to create my own blog.

WordPress looks outdated and all headless CMS looks like overhead.

So this is simple API that able to convert Markdown files into html pages.
Yes, it's possible to do it without API at all, but I wanted some options to extend API by my own
For example it's still possible to connect database and collect comments

Also, I'm looking for some safe place to store all data (texts and images) and Github looks perfect.
As a bonus I have backups for every change I made.

## How to use
### Preparation
1. Fork repository
2. Extend **supportedEntities** in config with your own entities (you can add your own entities such as Pages, Notes, e.t.c.)
3. Create entity or use existed in source folder. 
4. Add your Markdown page
5. Mare sure that all attachments placed in their folder and they accessible from your md file
6. Add in meta section any json data you want (see example in ./source/posts/example-post.md)

### Deploy
- Simply run docker container and your new entity will be accessible by `${host}/api/${entity` & `${host}/api/${entity/:slug`
- If you don't want to use docker - call `npm run build` command on your server before application starts

To run Docker - build image `docker build . -t app/markdown-blog` and run `docker run -p 3000:3000 -d app/markdown-blog`
### API 
Only GET entity requests implemented:
- GET `/posts`
- GET `/posts/:slug` where slug is equal to filename

GET /posts accepts only pagination parameters:

- page - integer
- limit - integer

## How it works
### Build
1. Scan source directory and find all .md files
2. Separate meta & md section
3. md converted to html
4. meta parsed as json
5. using git timestamps detecting when file was added/modified
6. all data (html, meta and timestamps) converted to json file and placed in public folder
7. all attachments paths in html replaced to [[**CDN_URL**]] keyword
8. all attachments move to public folder as they are
### Application start
1. All jsons from public directory load into memory
2. Build index by slugs and timestamps to fast search entities
3. Running express application to serve files