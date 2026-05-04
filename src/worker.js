const COMMENTS_CACHE_KEY = 'https://namu002.local/comments';
const MAX_COMMENTS = 80;
const MAX_NAME_LENGTH = 24;
const MAX_MESSAGE_LENGTH = 400;

const jsonHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
};

function jsonResponse(body, init = {}) {
    return new Response(JSON.stringify(body), {
        ...init,
        headers: {
            ...jsonHeaders,
            ...(init.headers || {})
        }
    });
}

function cleanText(value, maxLength) {
    return String(value || '')
        .replace(/[\u0000-\u001f\u007f]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, maxLength);
}

async function readComments() {
    const cached = await caches.default.match(COMMENTS_CACHE_KEY);

    if (!cached) {
        return [];
    }

    try {
        const data = await cached.json();
        return Array.isArray(data.comments) ? data.comments : [];
    } catch {
        return [];
    }
}

async function writeComments(comments) {
    await caches.default.put(
        COMMENTS_CACHE_KEY,
        jsonResponse(
            { comments },
            {
                headers: {
                    'Cache-Control': 'public, max-age=31536000'
                }
            }
        )
    );
}

async function handleGetComments() {
    return jsonResponse({ comments: await readComments() });
}

async function handleCreateComment(request) {
    let payload;

    try {
        payload = await request.json();
    } catch {
        return jsonResponse({ error: '댓글 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    const name = cleanText(payload.name || '익명', MAX_NAME_LENGTH) || '익명';
    const message = cleanText(payload.message, MAX_MESSAGE_LENGTH);

    if (!message) {
        return jsonResponse({ error: '댓글 내용을 입력해 주세요.' }, { status: 400 });
    }

    const comments = await readComments();
    const comment = {
        id: crypto.randomUUID(),
        name,
        message,
        createdAt: new Date().toISOString()
    };
    const nextComments = [comment, ...comments].slice(0, MAX_COMMENTS);

    await writeComments(nextComments);

    return jsonResponse({ comments: nextComments }, { status: 201 });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === '/api/comments' && request.method === 'GET') {
            return handleGetComments();
        }

        if (url.pathname === '/api/comments' && request.method === 'POST') {
            return handleCreateComment(request);
        }

        if (url.pathname.startsWith('/api/')) {
            return jsonResponse({ error: 'API를 찾을 수 없습니다.' }, { status: 404 });
        }

        return env.ASSETS.fetch(request);
    }
};
