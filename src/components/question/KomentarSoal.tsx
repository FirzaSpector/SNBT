"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, Send, Reply, User } from "lucide-react";
import { toast } from "sonner";
import type { KomentarSoal as KomentarType } from "@/types";

interface KomentarSoalProps {
  soalId: string;
}

/**
 * StackOverflow-style comment thread per question.
 */
export function KomentarSoal({ soalId }: KomentarSoalProps) {
  const [comments, setComments] = useState<KomentarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = () => {
    fetch(`/api/komentar?soalId=${soalId}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) setComments(result.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, [soalId]);

  const handleSubmit = async (parentId?: string) => {
    const text = parentId ? replyText : newComment;
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/komentar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soalId, konten: text, parentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal mengirim komentar");
      }

      toast.success("Komentar terkirim!");
      if (parentId) {
        setReplyText("");
        setReplyTo(null);
      } else {
        setNewComment("");
      }
      fetchComments();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal mengirim komentar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (komentarId: string, value: 1 | -1) => {
    try {
      await fetch(`/api/komentar/${komentarId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      fetchComments();
    } catch {
      toast.error("Gagal memproses vote");
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: KomentarType; isReply?: boolean }) => (
    <div className={`${isReply ? "ml-8 pl-4 border-l-2 border-border" : ""} py-3`}>
      <div className="flex items-start gap-3">
        {/* Vote buttons */}
        <div className="flex flex-col items-center gap-0.5 pt-1">
          <button
            onClick={() => handleVote(comment.id, 1)}
            className="p-1 rounded hover:bg-surface transition-colors text-text-muted hover:text-primary"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <span className={`text-xs font-bold ${(comment.upvotes - comment.downvotes) > 0 ? "text-primary" : (comment.upvotes - comment.downvotes) < 0 ? "text-danger" : "text-text-muted"}`}>
            {comment.upvotes - comment.downvotes}
          </span>
          <button
            onClick={() => handleVote(comment.id, -1)}
            className="p-1 rounded hover:bg-surface transition-colors text-text-muted hover:text-danger"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {comment.user?.fullName || comment.user?.username || "Anonim"}
            </span>
            <span className="text-xs text-text-muted">
              {new Date(comment.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            {comment.isEdited && <span className="text-xs text-text-muted">(diedit)</span>}
          </div>

          <p className="text-sm text-text-secondary whitespace-pre-wrap">{comment.konten}</p>

          {!isReply && (
            <button
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-primary mt-2 transition-colors"
            >
              <Reply className="w-3 h-3" />
              Balas
            </button>
          )}

          {/* Reply input */}
          {replyTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan..."
                className="flex-1 h-9 rounded-lg border border-border bg-surface px-3 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(comment.id)}
              />
              <button
                onClick={() => handleSubmit(comment.id)}
                disabled={submitting || !replyText.trim()}
                className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6 border-t border-border pt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-700 text-text-primary">
          Diskusi ({comments.length})
        </h3>
      </div>

      {/* New comment input */}
      <div className="flex gap-2 mb-6">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis pertanyaan atau komentar tentang soal ini..."
          className="flex-1 h-11 rounded-xl border border-border bg-surface px-4 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button
          onClick={() => handleSubmit()}
          disabled={submitting || !newComment.trim()}
          className="px-4 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Kirim</span>
        </button>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-8 h-16 bg-surface rounded" />
              <div className="flex-1">
                <div className="h-3 bg-surface rounded w-1/4 mb-2" />
                <div className="h-4 bg-surface rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-text-muted">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Belum ada diskusi. Jadilah yang pertama bertanya!</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
