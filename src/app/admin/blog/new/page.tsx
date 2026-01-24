"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Send } from "lucide-react";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewBlogPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    coverImage: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    published: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const handleTitleBlur = () => {
    if (form.title && !form.slug) {
      setForm({ ...form, slug: generateSlug(form.title) });
    }
  };

  const handleSubmit = async (publish: boolean) => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    if (!form.slug.trim()) {
      alert("Slug is required");
      return;
    }
    if (!form.content.trim()) {
      alert("Content is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          published: publish,
          publishedAt: publish ? new Date().toISOString() : null,
        }),
      });

      if (res.ok) {
        router.push("/admin/blog");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-xl font-bold text-text-dark hover:text-primary transition-colors"
              >
                Arbafix Admin
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href="/admin/blog"
                className="text-text-body hover:text-text-dark transition-colors"
              >
                Blog
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-text-body">New Post</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/blog"
              className="p-2 text-text-body hover:text-text-dark transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-text-dark">New Blog Post</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-text-dark font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              onBlur={handleTitleBlur}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Enter post title"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-text-body">/blog/</span>
              <input
                type="text"
                id="slug"
                value={form.slug}
                onChange={(e) =>
                  setForm({ ...form, slug: generateSlug(e.target.value) })
                }
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="url-friendly-slug"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Excerpt
              <span className="text-text-body font-normal ml-2">
                (160 characters recommended for SEO)
              </span>
            </label>
            <textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              placeholder="A brief description of your post..."
            />
            <p className="mt-1 text-sm text-text-body">
              {form.excerpt.length}/160 characters
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImage"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-text-dark mb-2"
            >
              Content (HTML) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={15}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-sm"
              placeholder="<p>Your blog content here...</p>"
            />
          </div>

          {/* SEO Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-text-dark mb-4">
              SEO Settings
            </h3>

            {/* Meta Title */}
            <div className="mb-4">
              <label
                htmlFor="metaTitle"
                className="block text-sm font-medium text-text-dark mb-2"
              >
                Meta Title
                <span className="text-text-body font-normal ml-2">
                  (defaults to post title if empty)
                </span>
              </label>
              <input
                type="text"
                id="metaTitle"
                value={form.metaTitle}
                onChange={(e) =>
                  setForm({ ...form, metaTitle: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Custom SEO title"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label
                htmlFor="metaDescription"
                className="block text-sm font-medium text-text-dark mb-2"
              >
                Meta Description
                <span className="text-text-body font-normal ml-2">
                  (defaults to excerpt if empty)
                </span>
              </label>
              <textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(e) =>
                  setForm({ ...form, metaDescription: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Custom SEO description"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
