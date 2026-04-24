export const getYoutubeThumbnailUrl = (url: string) => {
    const filteredUrl = url.replace('https://youtu.be/', '');
    return `	https://img.youtube.com/vi/${filteredUrl}/maxresdefault.jpg`
}