const commentForm = document.querySelector('#commentForm');
const commentName = document.querySelector('#commentName');
const commentMessage = document.querySelector('#commentMessage');
const commentWebsite = document.querySelector('#commentWebsite');
const commentStatus = document.querySelector('#commentStatus');
const commentList = document.querySelector('#commentList');
const commentStorageKey = 'pto-comment-name';

function setCommentStatus(message, isError = false) {
    commentStatus.textContent = message;
    commentStatus.dataset.state = isError ? 'error' : 'ok';
}

function formatCommentTime(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderComments(comments) {
    commentList.textContent = '';

    if (comments.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-comments';
        empty.textContent = '아직 댓글이 없습니다.';
        commentList.append(empty);
        return;
    }

    comments.forEach((comment) => {
        const item = document.createElement('article');
        item.className = 'comment-item';

        const meta = document.createElement('div');
        meta.className = 'comment-meta';

        const author = document.createElement('strong');
        author.textContent = comment.name || '익명';

        const time = document.createElement('time');
        time.dateTime = comment.createdAt || '';
        time.textContent = formatCommentTime(comment.createdAt);

        const message = document.createElement('p');
        message.textContent = comment.message || '';

        meta.append(author, time);
        item.append(meta, message);
        commentList.append(item);
    });
}

async function loadComments() {
    try {
        const response = await fetch('/api/comments');

        if (!response.ok) {
            throw new Error('댓글을 불러오지 못했습니다.');
        }

        const data = await response.json();
        renderComments(data.comments || []);
    } catch (error) {
        renderComments([]);
        setCommentStatus('댓글 서버 연결을 확인해 주세요.', true);
    }
}

function syncSavedCommentName() {
    try {
        const savedName = localStorage.getItem(commentStorageKey);

        if (savedName) {
            commentName.value = savedName;
        }
    } catch {
        // Comments still work when local storage is unavailable.
    }
}

commentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = commentName.value.trim() || '익명';
    const message = commentMessage.value.trim();

    if (!message) {
        setCommentStatus('댓글 내용을 입력해 주세요.', true);
        return;
    }

    if (commentWebsite.value.trim()) {
        return;
    }

    commentForm.querySelector('button').disabled = true;
    setCommentStatus('댓글을 저장하는 중입니다.');

    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '댓글 저장에 실패했습니다.');
        }

        try {
            localStorage.setItem(commentStorageKey, name);
        } catch {
            // Saving the nickname is only a convenience.
        }

        commentMessage.value = '';
        renderComments(data.comments || []);
        setCommentStatus('댓글이 등록됐습니다.');
    } catch (error) {
        setCommentStatus(error.message || '댓글 저장에 실패했습니다.', true);
    } finally {
        commentForm.querySelector('button').disabled = false;
    }
});

syncSavedCommentName();
loadComments();
