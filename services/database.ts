import * as SQLite from "expo-sqlite";

let db: any = null;

export async function openDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("words.db");
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL,
            translation TEXT NOT NULL,
            level INTEGER NOT NULL DEFAULT 1,
            next_repeat_date TEXT DEFAULT (date('now')),
            created_at TEXT DEFAULT (date('now'))
        )
    `);
  }

  return db
}

export async function saveWordDB(word: string, translation: string) {
  console.log("saveWordDB", word, translation);
  const result = await db.runAsync(
    `INSERT INTO words (word, translation) VALUES (?,?)`,
    [word, translation]
  );
}

export interface wordProps {
  id: number;
  word: string;
  translation: string;
  level: number;
  created_at: string;
  next_repeat_date: string;
}

export async function getWordsDB(): Promise<wordProps[]> {
  const result: wordProps[] = await db.getAllAsync(`SELECT * FROM words`);
  return result;
}

export async function deleteWordDB(word: string) {
  await db.runAsync(`DELETE FROM words WHERE word = ?`, [word]);
}

export async function updateWordDB(
  newWord: string,
  newTranslation: string,
  oldWord: string
) {
  await db.runAsync(
    `UPDATE words SET word = ?, translation = ? WHERE word = ?`,
    [newWord, newTranslation, oldWord]
  );
}

export async function deleteTable(TableName: string) {
  await db.runAsync(`DROP TABLE IF EXISTS ${TableName}`);
  console.log("Удалено");
}

export async function getWordCards() {
  try {
    const cards: Array<wordProps> = await db.getAllAsync(
      `SELECT * FROM words
       WHERE next_repeat_date <= date('now')`
    );

    const sorted_cards = cards.sort(
      (a: wordProps, b: wordProps) => a.level - b.level
    );

    return sorted_cards;
  } catch (err) {
    console.log(err);
  }
}

export async function getRandomWordDB() {
  try {
    let word: wordProps;
    const data: wordProps | null = await db.getFirstAsync(
      `SELECT * FROM words 
      ORDER BY RANDOM()
      LIMIT 1`
    );

    if (data) {
      word = data;
      return word;
    }
  } catch (err) {
    console.log("err: ", err);
  }
}

export async function UpdateWordLevel(word_id: number, know: boolean) {
  const db = await openDatabase();
  if (!know) {
    await db.runAsync(
      `
    UPDATE words
    SET level = CASE
        WHEN level > 1 THEN level - 1
        ELSE level
    END
    WHERE id = ? 
    `,
      [word_id]
    );
  } else {
    await db.runAsync(`UPDATE words SET level = level + 1 WHERE id = ?`, [
      word_id,
    ]);
  }

  const data = await db.getFirstAsync(`SELECT * FROM words WHERE id = ?`, [
    word_id,
  ]);

  if (data) {
    const word: wordProps = data as wordProps;
    let add_day: number = 0;

    switch (word.level) {
      case 1:
        break;
      case 2:
        add_day += 2;
        break;
      case 3:
        add_day += 7;
        break;
      case 4:
        add_day += 14;
        break;
      case 5:
        add_day += 30;
        break;
    }

    if (typeof add_day == "number") {
      await db.runAsync(
        `UPDATE words SET next_repeat_date = date('now', '+${add_day} days') WHERE id = ?`,
        [word_id]
      );
    }
  }
}
