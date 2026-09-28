import { getTranslations } from "next-intl/server";
import { ProgramCard } from "@/components/program-card";
import { Link } from "@/i18n/navigation";
import { seoMetadata } from "@/lib/page-metadata";
import { requireUser } from "@/lib/require-auth";
import {
  getStudentCourses,
  groupStudentCourses,
} from "@/lib/student-courses";
import type { ProgramSummary } from "@/lib/program-display";

export async function generateMetadata() {
  return seoMetadata("myCourses");
}

export default async function DashboardCoursesPage() {
  const t = await getTranslations("dashboard");
  const { user } = await requireUser();
  const programs = await getStudentCourses(user.id);
  const groups = groupStudentCourses(programs);

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">{t("courses")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("coursesLead")}
      </p>
      {programs.length === 0 ? (
        <EmptyCourses />
      ) : (
        <div className="mt-10 space-y-12">
          <CourseSection title={t("current")} programs={groups.current} />
          <CourseSection title={t("upcoming")} programs={groups.upcoming} />
          <CourseSection title={t("completed")} programs={groups.completed} />
        </div>
      )}
    </section>
  );
}

async function EmptyCourses() {
  const t = await getTranslations("dashboard");
  return (
    <>
      <p className="mt-8 text-sm text-ink-muted">{t("emptyCourses")}</p>
      <p className="mt-2">
        <Link
          href="/programs"
          className="inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
        >
          {t("browsePrograms")}
        </Link>
      </p>
    </>
  );
}

function CourseSection({
  title,
  programs,
}: {
  title: string;
  programs: ProgramSummary[];
}) {
  if (programs.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl">{title}</h2>
      <ul className="mt-5 grid gap-6 sm:grid-cols-2">
        {programs.map((program) => (
          <li key={program.id}>
            <ProgramCard program={program} />
          </li>
        ))}
      </ul>
    </section>
  );
}
