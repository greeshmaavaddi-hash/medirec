CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  generic TEXT NOT NULL,
  indications TEXT[] NOT NULL,
  contraindications TEXT[] NOT NULL DEFAULT '{}',
  min_age INT NOT NULL DEFAULT 0,
  otc BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE recommendation_log (
  id SERIAL PRIMARY KEY,
  user_id INT,                       -- set by Person 1's login; NULL until then
  request JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
-- Sample data only. Replace with a verified drug database before real use.
INSERT INTO medicines (name, generic, indications, contraindications, min_age, otc) VALUES
('Crocin','paracetamol','{fever,headache,body pain}','{liver disease}',1,true),
('Brufen','ibuprofen','{headache,body pain,inflammation,fever}','{ulcer,kidney disease,asthma}',12,true),
('Cetirizine','cetirizine','{sneezing,runny nose,itching,allergy}','{}',6,true),
('Digene','antacid','{acidity,heartburn,indigestion}','{}',12,true),
('ORS','oral rehydration salts','{diarrhea,dehydration}','{}',0,true),
('Benadryl','diphenhydramine','{cough,runny nose,sneezing}','{glaucoma}',12,true);
