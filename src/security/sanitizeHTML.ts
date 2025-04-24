import sanitizeHtml from 'sanitize-html';

export default function sanitize(content: string){
    return sanitizeHtml(content, {
        allowedTags: [],
        allowedAttributes: {}
        });
}