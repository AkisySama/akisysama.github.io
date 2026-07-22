import { collection, config, fields } from "@keystatic/core";

const listItemLabel = (item: { value: string }) => item.value || "未填写";

export default config({
  storage: {
    kind: "local",
  },
  locale: "zh-CN",
  ui: {
    brand: {
      name: "Akisy 博客写作台",
    },
  },
  collections: {
    blog: collection({
      label: "博客文章",
      path: "src/content/blog/*",
      slugField: "title",
      entryLayout: "content",
      format: {
        contentField: "body",
      },
      previewUrl: "/posts/{slug}/",
      columns: ["title", "pubDate", "draft"],
      schema: {
        title: fields.slug({
          name: {
            label: "标题",
            description: "显示在文章页和文章列表中的标题。",
            validation: { isRequired: true },
          },
          slug: {
            label: "文件名与网址",
            description: "建议使用简短的英文或拼音，例如 my-new-post。",
          },
        }),
        description: fields.text({
          label: "摘要",
          description: "用于文章列表和搜索引擎；不填时会从正文自动截取。",
          multiline: true,
        }),
        pubDate: fields.date({
          label: "发布日期",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: "更新日期",
          description: "只有文章有明显更新时才需要填写。",
        }),
        tags: fields.array(fields.text({ label: "标签" }), {
          label: "标签",
          description: "例如：技术、日常、旅行。",
          itemLabel: listItemLabel,
        }),
        categories: fields.array(fields.text({ label: "分类" }), {
          label: "分类",
          itemLabel: listItemLabel,
        }),
        draft: fields.checkbox({
          label: "草稿",
          description: "开启后文章不会显示在博客前台。",
          defaultValue: true,
        }),
        cover: fields.image({
          label: "封面图片",
          description: "不选择时使用博客默认封面。",
          directory: "public/images",
          publicPath: "/images/",
        }),
        body: fields.markdoc({
          label: "正文",
          extension: "md",
          options: {
            bold: true,
            italic: true,
            strikethrough: true,
            code: true,
            heading: [2, 3, 4, 5, 6],
            blockquote: true,
            orderedList: true,
            unorderedList: true,
            table: true,
            link: true,
            divider: true,
            codeBlock: true,
            image: {
              directory: "public/images",
              publicPath: "/images/",
              schema: {
                alt: fields.text({
                  label: "图片说明",
                  description: "简要描述图片内容，便于无障碍访问。",
                }),
                title: fields.text({ label: "图片标题" }),
              },
            },
          },
        }),
      },
    }),
  },
});
