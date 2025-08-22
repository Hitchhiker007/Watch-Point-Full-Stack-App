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
        <div>
            <h3>Comments</h3>
            <div>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    />
                    <button onClick={handleAddComment}>Post</button>
            </div>

            <ul>
                {comments.map((c) => (
                    <li key={c.id}>
                        <strong>{c.uid}</strong>: {c.text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

