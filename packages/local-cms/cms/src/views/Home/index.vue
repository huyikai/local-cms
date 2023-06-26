<template>
  <div class="home">
    <a-typography>
      <a-typography-title>LocalCMS</a-typography-title>
      <a-typography-title :level="2">Introduction</a-typography-title>
      <a-typography-paragraph>
        LocalCMS 开发缘由，作为开发人员，往往会使用静态站点生成器（比如
        <a-typography-text code>Vitepress</a-typography-text>、
        <a-typography-text code>Hugo</a-typography-text>、
        <a-typography-text code>Jekyll</a-typography-text>...
        ）来协助自己搭建文档或者个人站点，在使用过程中发现，虽然这些生成器已经很方便使用，但仍然有一定的开发成本，尤其是在有多个、大量文档需要管理的情况下。因此想进一步简化这个过程的操作，减少一些使用过程中的心智负担来更加专注于内容的创作和管理。
      </a-typography-paragraph>
      <a-typography-paragraph>
        在开发这个 LocalCMS 之前,对个人常用的 vitepress
        做了一些便于配置的开发，比如
        <a-typography-text code> 自动生成导航栏 </a-typography-text>、
        <a-typography-text code> 自动生成侧边栏 </a-typography-text>
        并且搭了一个脚手架这样就可以通过终端命令开箱即用（
        <a-typography-text code> vitepress-custom </a-typography-text>）。
        在使用它完成了几个文档的撰写后感觉，要达到真正便捷的开箱即用的标准，还是差了些，于是，这个
        LocalCMS 提上了开发日程
      </a-typography-paragraph>
      <a-typography-paragraph>
        下面谈谈之所以选择开发一个 LocalCMS ，而不是使用现有开源 CMS
        系统的原因。
      </a-typography-paragraph>
      <a-typography-paragraph>
        常见的静态站点生成器使用方式是编辑内容然后将代码推送到代码仓库，通过代码仓库自带的
        Pages 和工作流自动生成站点访问。也可以在自己的服务器上直接放置 dist
        文件或者通过容器部署。 而目前了解的大多数 CMS
        系统需要数据库来对内容进行存储，并且需要服务器来提供接口。通过 API
        获取内容的使用方式，看似在更符合认知，但实际上会增加额外的开发成本、使用成本，因为和静态站点生成器是分离的使用体验也有所割裂。并且
        API 的方式获取内容对于 SEO
        也不够友好。还有如果需要更好的版本控制和协作体验，往往需要开通付费订阅。而常见静态站点生成器的使用方法通过代码仓库管理本身就具备良好的版本控制和协作体验。还存在一种基于
        Git 的 CMS
        管理系统，相比较更适合，但也存在使用成本和体验的问题。当然这并不是这些
        CMS 系统的问题，只是使用场景没有契合。
      </a-typography-paragraph>
      <a-typography-paragraph>
        综上 LocalCMS 应运而生。
      </a-typography-paragraph>

      <a-typography-title :level="2">Features</a-typography-title>
      <a-typography-paragraph>
        <ul>
          <li>
            文件\目录
            <ul>
              <li>新建、修改、删除、搜索</li>
              <li>文件\目录重命名</li>
            </ul>
          </li>
          <li>
            Markdown 文件编辑
            <ul>
              <li>编辑实时预览</li>
              <li>实时保存，无需手动保存</li>
            </ul>
          </li>
        </ul>
      </a-typography-paragraph>
      <a-typography-title :level="2">TODO</a-typography-title>
      <a-typography-paragraph>
        <ul>
          <li>文件、目录移动</li>
          <li>文件导入/批量</li>
          <li>链接内容导入</li>
          <li>版本控制</li>
          <li>静态资源（图片）管理</li>
        </ul>
      </a-typography-paragraph>
    </a-typography>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding: 20px 60px;
}
</style>
