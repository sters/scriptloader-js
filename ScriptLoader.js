export class ScriptLoader {
    constructor() {
        this.registered = {};
        this.loaded = {};
        this.loadingResolves = {};
    }

    load(src) {
        if (this.loaded[src]) {
            return;
        }
        if (this.registered[src]) {
            return new Promise((resolve) => {
                this.loadingResolves[src].push(resolve);
            });
        }

        this.registered[src] = true;
        this.loadingResolves[src] = [];

        return new Promise((resolve) => {
            const e = document.createElement('script');
            e.defer = true;
            e.src = src;
            e.addEventListener('load', () => {
                this.loaded[src] = true;
                resolve();
                this.loadingResolves[src].forEach((r) => {
                    r();
                });
                delete this.loadingResolves[src];
            });

            document.body.appendChild(e);
        });
    }
}
