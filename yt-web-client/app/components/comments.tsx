"use client";

import { useEffect, useState } from "react";
import { addComment, getComments } from "../firebase/functions";
import { getAuth } from "firebase/auth";
import "./comments.css";

interface Comment {
  id: string;
  uid: string;
  text: string;
  photoURL: string;
  email: string;
  createdAt?: number; // timestamp in milliseconds
}

export default function Comments({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const auth = getAuth();

  // fetch comments when videoId changes
  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await getComments(videoId);
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    fetchComments();
  }, [videoId]);

  // adds new comment
  async function handleAddComment() {
    if (!auth.currentUser) {
      alert("You need to be signed in to comment");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const added = await addComment(videoId, newComment);
      // ensire 'added' has all required properties for Comment
      const completeAdded: Comment = {
        id: added.id,
        uid: added.uid,
        text: added.text,
        photoURL: (added as Comment).photoURL || auth.currentUser?.photoURL || "/default_user.png",
        email: (added as Comment).email || auth.currentUser?.email || "",
        createdAt: (added as Comment).createdAt,
      };
      setComments((prev) => [completeAdded, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  return (
    <div className="comments-container">
      <h3 className="comments-header">{comments.length} Comments</h3>

      {/* Add Comment */}
      <div className="add-comment">
        <div className="add-comment-image">
          <img
            src={auth.currentUser?.photoURL || "/default_user.png"}
            alt="avatar"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
          />
          <div className="comment-button-container">
            <button onClick={handleAddComment} className="comment-button">
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <ul className="comments-list">
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <img
             src={(c as any).photoURL || (c as any).photoUrl || "/default_user.png"}
              alt="avatar"
              className="comment-avatar"
            />
            <div className="flex-1">
              <div className="comment-header">
                <span className="comment-username">{c.email || c.uid}</span>
                {c.createdAt && (
                  <span className="comment-time">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                )}
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
