export type Role = "admin" | "member";
export type ReactionKind = "like" | "celebrate" | "insightful";

export type Profile = { id: string; full_name: string; role: Role };

export type Comment = {
  id: string;
  body: string;
  created_at: string;
  author: { id: string; full_name: string } | null;
};

export type Post = {
  id: string;
  body: string;
  link_url: string | null;
  media_path: string | null;
  media_type: "image" | "video" | null;
  created_at: string;
  author: { id: string; full_name: string } | null;
  comments: Comment[];
  reactions: { user_id: string; kind: ReactionKind }[];
};
