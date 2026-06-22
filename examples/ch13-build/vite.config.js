import { defineConfig } from "vite";

export default defineConfig({
  // ANCHOR: pages-base
  // GitHub Pages 프로젝트 서브경로(https://OWNER.github.io/REPO-NAME/)에 배포할 때
  // base를 "/REPO-NAME/"로 설정해야 에셋 경로가 404 나지 않습니다.
  // 이 튜토리얼에서는 "/Fable-Tutorial/"이 실제 서브경로입니다.
  base: "/Fable-Tutorial/",
  // ANCHOR_END: pages-base
  server: {
    watch: {
      ignored: ["**/*.fs", "**/*.fsproj", "**/obj/**"]
    }
  }
});
