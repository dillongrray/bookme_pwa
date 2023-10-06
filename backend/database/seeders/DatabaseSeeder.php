<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $bookImageBasePath = env('IMAGE_PATH', 'http://localhost:8080/storage/');
        DB::table('books')->insert([
            ['book_name' => 'Da Vinci Code', 'book_description' => "The Da Vinci Code by Dan Brown is a gripping and controversial thriller that takes readers on a high-stakes quest to unravel the mysteries surrounding art, religion, and history. When renowned Harvard symbologist Robert Langdon is called to the Louvre Museum to examine a murder victim's cryptic symbols, he becomes embroiled in a complex web of secrets that lead him on a thrilling chase across Europe. As Langdon and cryptologist Sophie Neveu follow a trail of hidden clues, they uncover a startling conspiracy that challenges the foundations of Christianity and the very essence of Leonardo da Vinci's art. This meticulously researched and fast-paced novel combines art, history, and suspense into a page-turning adventure that keeps readers on the edge of their seats, making it one of the most popular and thought-provoking books of its time.", 'book_quantity' => 15, 'book_image_location' => $bookImageBasePath . '1.jpg'],
            ['book_name' => 'Harry Potter and the Deathly Hallows', 'book_description' => "Harry Potter and the Deathly Hallows by J.K. Rowling is the epic conclusion to the beloved Harry Potter series. In this thrilling and emotionally charged novel, Harry, Ron, and Hermione set out on a perilous quest to destroy the remaining Horcruxes and vanquish the dark wizard Lord Voldemort once and for all. As the Wizarding World plunges into chaos and war, the trio's loyalty, courage, and friendship are tested to their limits. Rowling masterfully weaves together the threads of the entire series, answering long-standing questions and delivering heart-wrenching moments of sacrifice and heroism. This book not only provides a satisfying resolution to the overarching conflict but also explores profound themes of love, loss, and the power of choice. Harry Potter and the Deathly Hallows is a literary triumph that captivates readers of all ages with its richly imagined world and unforgettable characters.", 'book_quantity' => 10, 'book_image_location' => $bookImageBasePath . '2.jpg'],
            ['book_name' => "Harry Potter and the Philosopher's Stone", 'book_description' => "Harry Potter and the Philosopher's Stone by J.K. Rowling introduces readers to the magical world of Hogwarts and the young wizard Harry Potter. Orphaned as a baby and raised by his cruel aunt and uncle, Harry discovers on his eleventh birthday that he is a wizard with a destiny he could never have imagined. The book follows Harry as he embarks on his journey into the world of wizardry, where he makes friends, learns about his parents' mysterious past, and encounters the dark forces that threaten the wizarding world. Rowling's enchanting storytelling and imaginative world-building make this book a timeless classic for readers of all ages. It's a tale of bravery, friendship, and the enduring battle between good and evil, and it sets the stage for the epic adventures that follow in the Harry Potter series.", 'book_quantity' => 12, 'book_image_location' => $bookImageBasePath . '3.jpg'],
            ['book_name' => 'Harry Potter and the Order of the Phoenix', 'book_description' => "Harry Potter and the Order of the Phoenix by J.K. Rowling is the fifth installment in the beloved Harry Potter series. In this thrilling novel, Harry returns to Hogwarts School of Witchcraft and Wizardry for his fifth year, only to find that the wizarding world is in turmoil. The dark wizard Lord Voldemort is gaining power, and the Ministry of Magic refuses to acknowledge his return. Harry takes it upon himself to form a secret student group, Dumbledore's Army, to learn and practice defensive magic. As the wizarding world teeters on the brink of war, Harry and his friends face numerous challenges, both in their studies and in their personal lives. This book explores themes of rebellion, loss, and the sacrifices made in the fight against evil. With its rich character development and gripping plot, Order of the Phoenix is a testament to J.K. Rowling's storytelling prowess and her ability to tackle complex and mature themes within a young adult fantasy setting.", 'book_quantity' => 8, 'book_image_location' => $bookImageBasePath . '4.jpg'],
            ['book_name' => 'Fifty Shades of Grey', 'book_description' => "Fifty Shades of Grey by E. L. James is a provocative and controversial contemporary romance novel that explores themes of passion, desire, and the complexities of human relationships. The story follows the enigmatic billionaire Christian Grey and the young, inexperienced literature student Anastasia Steele. Their lives become entwined when Anastasia is assigned to interview Christian for her college newspaper, and a whirlwind romance ensues. However, Anastasia soon discovers that Christian has unconventional tastes and introduces her to the world of BDSM. The novel delves into the complexities of their intense, often tumultuous relationship, challenging societal norms and expectations. With its explicit content and exploration of themes related to power dynamics and consent, Fifty Shades of Grey ignited a cultural phenomenon and sparked widespread discussion, making it a significant work in contemporary literature.", 'book_quantity' => 20, 'book_image_location' => $bookImageBasePath . '5.jpg'],
            ['book_name' => 'Angels and Demons', 'book_description' => "Angels and Demons by Dan Brown takes readers on a heart-pounding journey through the dark underbelly of the Vatican and the world of secret societies. When renowned Harvard symbologist Robert Langdon is called to investigate the murder of a physicist at CERN and the theft of a canister of antimatter, he soon finds himself entangled in a web of ancient mysteries, religious intrigue, and a race against time. As Langdon follows a trail of cryptic clues and hidden symbols, he uncovers a plot by the Illuminati to wreak havoc on the Catholic Church and plunge the world into chaos. Brown's gripping storytelling, rich historical detail, and intricate puzzles make Angels and Demons a mesmerizing and intellectually stimulating thriller that keeps readers on the edge of their seats from the first page to the last.", 'book_quantity' => 25, 'book_image_location' => $bookImageBasePath . '6.jpg'],
            ['book_name' => 'Twilight', 'book_description' => "Twilight by Stephenie Meyer is a captivating young adult novel that redefined the vampire genre for a new generation. The story revolves around Bella Swan, a teenager who relocates to the gloomy town of Forks, Washington, and falls deeply in love with Edward Cullen, a mysterious and alluring vampire. Meyer weaves a tale of forbidden love, supernatural allure, and the complexities of fitting in, all set against the backdrop of the lush Pacific Northwest. As Bella and Edward's romance blossoms, they face a myriad of obstacles, including the threat of other vampires and the struggle to suppress Edward's primal instincts. Meyer's vivid storytelling and relatable characters make Twilight a page-turner that explores themes of love, identity, and the eternal struggle between good and evil in a thoroughly engaging way.", 'book_quantity' => 9, 'book_image_location' => $bookImageBasePath . '7.jpg'],
            ['book_name' => 'Girl with the Dragon Tattoo, The: Millennium Trilogy', 'book_description' => "The Girl with the Dragon Tattoo: Millennium Trilogy by Stieg Larsson is a thrilling crime and mystery novel that is part of the acclaimed Millennium series. The story introduces readers to Mikael Blomkvist, an investigative journalist, and Lisbeth Salander, a brilliant but enigmatic computer hacker. Together, they embark on a complex investigation into the disappearance of a young woman from a wealthy and dysfunctional family. Larsson's novel is a masterful blend of suspense, intrigue, and social commentary, delving into themes like corporate corruption, family secrets, and violence against women. The characters are compelling, and the intricate plot keeps readers on the edge of their seats. With its dark undertones and multifaceted narrative, The Girl with the Dragon Tattoo is a gripping and thought-provoking literary work that has earned its place among the best-selling novels of all time.", 'book_quantity' => 18, 'book_image_location' => $bookImageBasePath . '8.jpg'],
            ['book_name' => 'The Lovely Bones', 'book_description' => "The Lovely Bones by Alice Sebold is a haunting and emotionally charged novel that delves into the afterlife, trauma, and the enduring power of love. The story is narrated by Susie Salmon, a 14-year-old girl who watches over her family and friends from heaven after she is brutally murdered. As Susie observes the impact of her death on those she left behind, she yearns for justice and a sense of closure. Sebold's writing is both lyrical and raw, as she explores the complexities of grief and healing through the lens of a family torn apart by tragedy. This novel is a poignant exploration of loss, resilience, and the connections that bind us across life and death, making it a powerful and unforgettable read.", 'book_quantity' => 22, 'book_image_location' => $bookImageBasePath . '9.jpg'],
            ['book_name' => 'The Curious Incident of the Dog in the Night-time', 'book_description' => "The Curious Incident of the Dog in the Night-time by Mark Haddon is a unique and compelling novel that provides a glimpse into the mind of Christopher Boone, a 15-year-old boy with autism spectrum disorder. The story begins when Christopher discovers the dead body of his neighbor's dog and embarks on a mission to uncover the truth behind the mysterious incident. Through Christopher's first-person narrative, readers gain insight into his mathematical brilliance and unique perspective on the world. Haddon's writing beautifully captures Christopher's voice and his struggles to navigate a world that often overwhelms his senses. This novel is a touching exploration of love, family, and the resilience of the human spirit, making it a must-read for anyone seeking a fresh and empathetic perspective on neurodiversity.", 'book_quantity' => 11, 'book_image_location' => $bookImageBasePath . '10.jpg']
        ]);
        // User::factory(10)->create();
    }
}
