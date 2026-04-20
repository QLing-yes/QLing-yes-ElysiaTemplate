export default (app: Ctrl) => app.get("/test", () => $g.success("test"));
