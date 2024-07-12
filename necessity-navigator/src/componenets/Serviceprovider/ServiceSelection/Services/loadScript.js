export const loadScript = (url, callback) => {
    const existingScript = document.querySelector(`script[src="${url}"]`);

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.defer = true;

        script.onload = () => {
            callback();
        };

        document.head.appendChild(script);
    } else {
        if (callback) callback();
    }
};
