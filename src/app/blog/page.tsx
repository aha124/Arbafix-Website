import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";
import { Calendar, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog - Repair Tips & Gaming News | Arbafix",
  description:
    "Expert gaming console repair tips, troubleshooting guides, and the latest gaming news. Learn how to maintain your Nintendo, PlayStation, and Xbox consoles.",
  openGraph: {
    title: "Blog - Repair Tips & Gaming News | Arbafix",
    description:
      "Expert gaming console repair tips, troubleshooting guides, and the latest gaming news.",
    type: "website",
  },
};

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
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

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Repair Tips & Gaming News
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Expert guides, troubleshooting tips, and the latest updates from the
            world of gaming console repair.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-text-dark mb-2">
                Coming Soon
              </h2>
              <p className="text-text-body max-w-md mx-auto">
                Check back soon for repair tips and gaming news!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {post.coverImage && (
                    <Link href={`/blog/${post.slug}`}>
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-text-body mb-3">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.publishedAt?.toISOString()}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-semibold text-text-dark mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    {post.excerpt && (
                      <p className="text-text-body mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
