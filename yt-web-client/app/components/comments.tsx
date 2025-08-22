"use client";

import {useEffect, useState } from "react";
import {addComment, getComments} from "../firebase/functions";
import {getAuth} from "firebase/auth";

interface Comment {
    id: string;
    uid: string;
    text: string;
    createdAt?: string;
}

export default function Comments({ videoId}: {videoId:string}) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const auth = getAuth();

    useEffect(() => {
        async function fetchComments(){
            const data = await getComments(videoId);
            setComments(data);
        }
        fetchComments();
    }, [videoId]);

    async function handleAddComment() {
        if (!auth.currentUser) {
            alert("You need to be signed in to comment");
            return;
        }
        if (!newComment.trim()) return;
        
        const added = await addComment(videoId, newComment);
        setComments((prev) => [added, ...prev]);
        setNewComment("");
    }

    return (
        <div className="comments-container">
            <h3 className="comments-header">{comments.length} Comments</h3>

            <div className="add-comment">
                <img
                    src={auth.currentUser?.photoURL || "default-avatar.png"}
                    alt="avatar"
                />
                <div className="flex-1">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={2}
                    />
                    <div className="comment-button-container">
                    <button onClick={handleAddComment} className="comment-button">
                        Comment
                        </button>
                    </div>
                    </div>
            </div>


            <ul className="comments-list">
                {comments.map((c) => (
                    <li key={c.id} className="comment-item">
                        <img src="/default-avatr.png" alt="avatar" />
                            <div className="flex-1">
                                <div className="comment-header">
                                    <span className="comment-username">{c.uid}</span>
                                    {c.createdAt && (
                                        <span className="comment-time">
                                            {new Date(c.createdAt).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <p className="comment-text">{c.text}</p>
                                {/* <div className="comment-actions">
                                    <button> Like </button>
                                    <button> Dislike </button>
                                    <button>Reply</button>
                                </div> */}
                            </div>
            
                    </li>
                ))}
            </ul>
        </div>
    );
}

