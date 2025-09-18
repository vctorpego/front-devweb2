import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActorListProps {
  title: string;
  actors: string[];
}

const ActorList = ({ title, actors }: ActorListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-3">
        {actors.map((actor, index) => (
          <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted">
            <Avatar className="size-10">
              <AvatarFallback>{actor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{actor}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActorList;