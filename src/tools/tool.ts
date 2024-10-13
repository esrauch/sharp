
export abstract class Tool {
    private abortController: AbortController | null = null
    enable() {
        if (this.abortController) console.error('double tool enable?', this)
        this.abortController = new AbortController()
        this.enableInternal(this.abortController.signal)
    }

    disable() {
        if (!this.abortController) {
            console.error('disabled tool that was not enabled?', this)
            return
        }
        this.disableInternal()
        this.abortController.abort()
        this.abortController = null
    }

    protected enableInternal(signal: AbortSignal): void { }
    protected disableInternal(): void { }
}