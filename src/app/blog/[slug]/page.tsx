import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
      published: true,
    },
  });
  return post;
}

async function getRelatedPosts(currentSlug: string) {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
      slug: {
        not: currentSlug,
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });
  return posts;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | Arbafix",
    };
  }

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || "";

  return {
    title: `${title} | Arbafix Blog`,
    description,
    openGraph: {
      title: `${title} | Arbafix Blog`,
      description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Arbafix Blog`,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-body hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="aspect-video overflow-hidden rounded-xl bg-gray-100 mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-text-body mb-4">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt?.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-dark leading-tight">
              {post.title}
            </h1>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-strong:text-gray-900 prose-img:rounded-xl prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:marker:text-gray-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-8">
              More Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {relatedPost.coverImage && (
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-text-body mb-3">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={relatedPost.publishedAt?.toISOString()}>
                        {formatDate(relatedPost.publishedAt)}
                      </time>
                    </div>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <h3 className="text-lg font-semibold text-text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    {relatedPost.excerpt && (
                      <p className="text-text-body text-sm line-clamp-2 mb-4">
                        {relatedPost.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary-dark transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
