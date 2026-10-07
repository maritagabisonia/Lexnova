-- Contact-page FAQ items, editable from /admin/faq.
-- Public read for the contact accordion; admin-only writes. Bilingual
-- columns follow programs (English may be empty; Georgian is the fallback).

create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text,
  question_ka text,
  answer text,
  answer_ka text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint faq_items_question_present check (
    coalesce(nullif(btrim(question), ''), nullif(btrim(question_ka), '')) is not null
  ),
  constraint faq_items_answer_present check (
    coalesce(nullif(btrim(answer), ''), nullif(btrim(answer_ka), '')) is not null
  )
);

create trigger faq_items_set_updated_at
before update on public.faq_items
for each row
execute function public.set_updated_at();

create index faq_items_sort_order_idx
  on public.faq_items (sort_order, created_at);

alter table public.faq_items enable row level security;

create policy "faq_items_select_public"
on public.faq_items
for select
to anon, authenticated
using (true);

create policy "faq_items_insert_admin"
on public.faq_items
for insert
to authenticated
with check (public.is_admin());

create policy "faq_items_update_admin"
on public.faq_items
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "faq_items_delete_admin"
on public.faq_items
for delete
to authenticated
using (public.is_admin());

grant select on table public.faq_items to anon, authenticated;
grant insert, update, delete on table public.faq_items to authenticated;
grant all on table public.faq_items to service_role;

insert into public.faq_items (
  question,
  question_ka,
  answer,
  answer_ka,
  sort_order
)
values
(
  'How do I register for a course or training?',
  'როგორ დავრეგისტრირდე კურსზე ან ტრენინგზე?',
  $faq$Open the program page and use Register while registration is open. If you are not signed in, you will be asked to log in (or create a student account) and then returned to the program to complete enrollment.$faq$,
  $faq$გახსენით პროგრამის გვერდი და დააჭირეთ „რეგისტრაციას", სანამ რეგისტრაცია ღიაა. თუ შესული არ ხართ, ჯერ შეგთავაზებენ შესვლას (ან სტუდენტის ანგარიშის შექმნას) და შემდეგ პროგრამაზე დაგაბრუნებენ ჩაწერის დასასრულებლად.$faq$,
  1
),
(
  'Will I receive a certificate?',
  'მივიღებ სერტიფიკატს?',
  $faq$Participants who complete a course or training receive a LexNova certificate of completion by email. Workshops that have already closed can request a reissue from lexnova.center@gmail.com.$faq$,
  $faq$კურსის ან ტრენინგის დასრულების შემდეგ მონაწილეები LexNova-ს დასრულების სერტიფიკატს ელფოსტით იღებენ. უკვე დახურული ვორქშოპებისთვის ხელახალი გაგზავნა შეგიძლიათ მოითხოვოთ მისამართზე lexnova.center@gmail.com.$faq$,
  2
),
(
  'How does payment work?',
  'როგორ ხდება გადახდა?',
  $faq$Fees are listed on each program page. We will send payment instructions after you register. Group bookings for a workplace cohort can be invoiced; write to us with the program name and headcount.$faq$,
  $faq$საფასური თითოეული პროგრამის გვერდზეა მითითებული. გადახდის ინსტრუქციას რეგისტრაციის შემდეგ გამოგიგზავნით. სამუშაო ჯგუფის ჩაწერა შეიძლება ინვოისით; მოგვწერეთ პროგრამის სახელი და მონაწილეთა რაოდენობა.$faq$,
  3
),
(
  'Is attendance required? Can I join online?',
  'სავალდებულოა დასწრება? შემიძლია ონლაინ ჩართვა?',
  $faq$Check the format on the program page. Hybrid sessions can be joined in the Civic Classroom or live online. Online-only programs have no in-person seat. We expect attendance at the sessions you book.$faq$,
  $faq$ფორმატი პროგრამის გვერდზე შეამოწმეთ. ჰიბრიდულ სესიებს Civic Classroom-ში ან პირდაპირ ეთერში ონლაინ შეუძლიათ. მხოლოდ ონლაინ პროგრამებს ადგილზე ადგილი არ აქვს. ველით დასწრებას იმ სესიებზე, რომლებზეც ჩაიწერებით.$faq$,
  4
),
(
  'What is the cancellation policy?',
  'რა არის გაუქმების წესი?',
  $faq$Cancellations more than fourteen days before the start date are refunded in full. After that, we can transfer your place to a later edition of the same program where one exists. Write to lexnova.center@gmail.com with your name and the program title.$faq$,
  $faq$დაწყებამდე თოთხმეტ დღეზე მეტით გაუქმება სრულად ბრუნდება. შემდეგ თქვენი ადგილი იმავე პროგრამის მოგვიანებით გამოცემაზე შეიძლება გადავიტანოთ, თუ ასეთი არსებობს. მისამართზე lexnova.center@gmail.com მოგვწერეთ სახელი და პროგრამის სათაური.$faq$,
  5
);
