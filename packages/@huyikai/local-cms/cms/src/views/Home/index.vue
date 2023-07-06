<template>
  <div class="home">
    <img
      class="logo"
      src="@/assets/logo.svg"
      alt="logo"
    />

    <a-typography-title>Local-CMS</a-typography-title>
    <a-typography-title :level="4"> 欢迎使用</a-typography-title>
    <a-typography-title :level="5"> 希望它能够帮到你 </a-typography-title>
    <a-typography-paragraph>
      <ul>
        <li>
          使用过程中如果遇到问题，请提交
          <a-typography-link
            href="https://github.com/huyikai/local-cms/issues"
            target="_blank"
          >
            <question-circle-filled />
            issue
          </a-typography-link>
        </li>
        <li>
          如果觉得用起来还不错，麻烦给个

          <a-typography-link
            href="https://github.com/huyikai/local-cms"
            target="_blank"
          >
            <star-filled style="color: rgb(220, 180, 86)" />
            start
          </a-typography-link>
        </li>
        <li>
          如果想参与开发或者交流,请联系
          <a-typography-paragraph>
            <a-space :size="16">
              <a-typography-text
                :copyable="{
                  text: 'hyk_tiger@foxmail.com'
                }"
              >
                <mail-outlined /> hyk_tiger@foxmail.com
              </a-typography-text>
              <a-typography-text
                :copyable="{
                  text: 'huyikai'
                }"
              >
                <wechat-filled /> huyikai
              </a-typography-text>
            </a-space>
          </a-typography-paragraph>
        </li>
      </ul>
    </a-typography-paragraph>
  </div>
</template>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  position: relative;
}
.logo {
  display: block;
  width: 240px;
  height: 240px;
}
</style>
