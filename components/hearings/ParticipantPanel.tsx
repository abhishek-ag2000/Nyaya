import { initialsFromName, participantRoleLabel, type Hearing } from "@/data/hearings";

export default function ParticipantPanel({ hearing }: { hearing: Hearing }) {
  const participants = hearing.participants ?? [];
  return (
    <section className="participant-panel" aria-label="Participants">
      <h2>Participants</h2>
      <p className="participant-note">Display-only for this demo. These people are not connected live.</p>
      {!participants.length ? (
        <p className="calm-empty">No participants are listed for this hearing.</p>
      ) : (
        <ul>
          {participants.map((person) => (
            <li key={person.id}>
              <span className="participant-avatar" aria-hidden="true">{initialsFromName(person.name)}</span>
              <div>
                <b>{person.name}</b>
                <small>{participantRoleLabel(person.role)}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
