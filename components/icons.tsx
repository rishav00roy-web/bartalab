"use client";

// Kubai Icons (MIT, https://github.com/kubai087/kubai-icons). Each icon animates
// when its parent button or link is hovered, and respects reduced motion.
import * as K from "kubai-icons-react";

type P = { size?: number };
const wrap = (Icon: K.KubaiIconComponent, fallback: number) =>
  function KubaiWrapped({ size = fallback }: P) {
    return <Icon size={size} trigger="parent" aria-hidden="true" />;
  };

export const ThumbsUp = wrap(K.ThumbsUp, 18);
export const PartyPopper = wrap(K.PartyPopper, 18);
export const Lightbulb = wrap(K.Lightbulb, 18);
export const ImageIcon = wrap(K.Image, 18);
export const LinkIcon = wrap(K.Link, 18);
export const Trash = wrap(K.Trash, 16);
export const X = wrap(K.CircleX, 16);
export const Send = wrap(K.Send, 16);
export const Pin = wrap(K.Pin, 16);
export const Pencil = wrap(K.Pencil, 16);
export const Users = wrap(K.Users, 18);
export const Newspaper = wrap(K.Newspaper, 18);
export const LogOut = wrap(K.LogOut, 16);
export const MessageCircle = wrap(K.MessageCircle, 16);
