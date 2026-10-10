"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useAddComment, type CommentScope } from "@/hooks/use-comments";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  content: z.string().trim().min(1, "মন্তব্য লিখুন").max(1000, "মন্তব্য সর্বোচ্চ ১০০০ অক্ষরের হতে পারবে"),
});
type FormValues = z.infer<typeof schema>;

interface CommentFormProps {
  postId: string;
  scope?: CommentScope;
  parentId?: string;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  onDone?: () => void;
  onCancel?: () => void;
}

/** Used for new comments and for replies (pass parentId). */
export function CommentForm({
  postId, scope = "posts", parentId, placeholder = "আপনার মতামত লিখুন…", submitLabel = "মন্তব্য করুন", autoFocus, onDone, onCancel,
}: CommentFormProps) {
  const user = useAuthStore((s) => s.user);
  const { mutate, isPending } = useAddComment(postId, scope);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) =>
    mutate({
      content: values.content,
      parentId,
      authorName: user?.name && user.name !== "উদ্যোক্তা" ? user.name : "ব্যবহারকারী",
    }, {
      onSuccess: () => {
        reset();
        toast.success(parentId ? "উত্তর যোগ হয়েছে" : "মন্তব্য যোগ হয়েছে");
        onDone?.();
      },
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex gap-3">
      <UserAvatar name={user?.name} src={user?.avatar} className="h-10 w-10 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <Textarea
          aria-label={parentId ? "উত্তর লিখুন" : "মন্তব্য লিখুন"}
          placeholder={placeholder}
          autoFocus={autoFocus}
          invalid={!!errors.content}
          className="min-h-[88px]"
          {...register("content")}
        />
        {errors.content && <p role="alert" className="text-sm text-danger">{errors.content.message}</p>}
        <div className="flex justify-end gap-2">
          {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>বাতিল</Button>}
          <Button type="submit" size="sm" loading={isPending}>{submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}
