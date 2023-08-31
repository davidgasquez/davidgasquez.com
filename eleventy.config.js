const CleanCSS = require("clean-css");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.addPassthroughCopy({ "public": "/" });

    eleventyConfig.addFilter("postDate", dateObj => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED)
    })

    return {
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",

        dir: {
            input: "content",
            includes: "../_includes",
        },
    };
};
