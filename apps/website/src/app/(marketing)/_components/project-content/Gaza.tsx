import { PersonCard } from "../../team/_components/author-card";

export function Gaza() {
  return (
    <div>
      <div className="items-start">
        <div className="container px-4 md:px-6">
          <div className="grid w-full gap-8">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  ámaxa members on the Gaza project team are urgently raising
                  funds to support families trapped in Gaza amidst the ongoing
                  humanitarian crisis. For the Summer 2024 cohort, the team
                  focused on raising money. The funds went to two families we
                  connected with through our partner: Gaza Champions. These
                  funds were crucial for providing immediate essentials, such as
                  food, to prevent starvation and meet basic needs.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  This initiative represents one of Ámaxa’s most critical and
                  urgent efforts, and is unique in its directness and ability to
                  make a difference quickly. This direct and personal approach
                  ensures that the aid reaches those in desperate need without
                  the delays that can occur due to bureaucracy or politics. The
                  situation in Gaza is dire, with many families struggling to
                  access basic necessities due to severe restrictions and
                  ongoing conflict. By contributing to this project, students
                  can provide direct relief and support to those facing
                  unimaginable hardships.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  At ámaxa, we believe in the power of direct action and the
                  importance of community-driven support. The Gaza fundraising
                  project is not just about providing financial assistance; it’s
                  about standing in solidarity with those who are suffering and
                  using our resources to make a tangible impact. This project
                  embodies our commitment to humanitarian aid and our belief
                  that everyone deserves access to basic necessities, especially
                  in times of crisis. By supporting these families, we are not
                  only addressing immediate needs but also affirming our
                  dedication to human dignity and compassion.
                </p>
              </div>
            </div>
          </div>
          <div className="py-6">
            <h2 className="py-3 text-3xl font-bold">Meet the Team</h2>
            <div className="grid grid-cols-3 grid-rows-3">
              <PersonCard
                name="Lauren McMillen"
                role="Founder & CEO * Head Coach"
                image="/lauren-headshot.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
